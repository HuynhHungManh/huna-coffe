import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';
import {Plans} from 'api';
import L from 'leaflet';
import { Map, ImageOverlay, Marker, Popup, TileLayer } from 'react-leaflet';
import 'react-leaflet-fullscreen/dist/styles.css';
import 'leaflet/dist/leaflet.css';
import ReactAutocomplete from 'react-autocomplete';
import FullscreenControl from 'react-leaflet-fullscreen';

class ViewMapPlan extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      id: this.props.match.params.id,
      title: '',
      imagePath: '',
      northEast: '',
      southWest: '',
      urlFile: '',
      isOpen: false,
      draggable: false,  
      search: '',    
      data: [], 
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentWillMount(){ 
    let file = this.props.plans.find((item) => item.id == this.props.match.params.id);    
    this.setState({
      id: file && file.id || '',
      title: file && file.title && file.title.rendered ? file.title.rendered : '',
      urlFile: file && file.acf && file.acf.map_plan && file.acf.map_plan.url || '',
      imagePath: file && file.image_path || '',
      northEast: file && file.acf.north_east || '',
      southWest: file && file.acf.south_west || '',
    })
  }
  componentDidMount() {
    let tiles = L.tileLayer(this.state.imagePath, {
      minZoom: 3,
      maxZoom: 5,
      noWrap: true,
      tms: true
    });
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 3,
      minZoom: 3,
      maxZoom: 5,
      layers:[tiles],
      zoomControl: true,
      dragging: true,
      touch: true,
      tap: true,      
    });
    let northEast = L.latLng(this.state.northEast.lat,this.state.northEast.lng);
    let southWest = L.latLng(this.state.southWest.lat, this.state.southWest.lng);
    let bounds = new L.LatLngBounds(northEast, southWest);
    this.map.setMaxBounds(bounds);
    this.layer = L.layerGroup().addTo(this.map);
    this.getLocation(this.state.id);
  }
  popupOptions(options){
    if(!options) return;
    options.offset = new L.Point(10, 10);
    options.maxWidth = "320";
    options.minWidth = "200";
    return options;
  }
  tooltipOptions(options){
    if(!options) return;
    options.sticky = true;
    // options.offset = new L.Point(10, 10);
    return options;
  }
  updateMarkers(markersData) { 
    // this.layer.clearLayers();
    const contentMarker = `<div class="ggmap-popup"><div class="ggmap-contentleft" style="background-image: url(${markersData.image});"></div><div class="ggmap-contentright"><h3 class="ggmap-title">${markersData.title}</h3><div class="ggmap-desc">${markersData.description}</div></div></div>`;

    markersData.locations.forEach(marker => {
      L.marker(
        marker,
        { title: markersData.title }
      ).addTo(this.layer).bindPopup(contentMarker,this.popupOptions({})).bindTooltip(markersData.title).openTooltip();
    });
  }
  getLocation(id){
    Plans.actions.locations.request({id: id}).then(res => {
      if (res.data) {
        this.setState({data: res.data});
        res.data.forEach(item => {
          this.updateMarkers(item);
        });
      }
    })
  }
  Truncate(titleName) {
    let len = 0;
    let trimmedTitle = '';
    let count=0;
    let i=0;
    for (i = 0, len = titleName.length; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==19){
        trimmedTitle = titleName.substring(0, i) + " ...";
        break;
      } else {
        trimmedTitle = titleName.substring(0, i+1);
      }
    }
    return trimmedTitle;
  }

  close() {
    this.setState({statusPopup: false})
  }

  onDragend(ev) {
    const tempLatLng = ev.target.getLatLng();
    console.log(ev.target.options.id);
  };
  handleChange(event) {
    this.setState({search: event.target.value});
  }
  handleSelect(value){ 
    let params = {
      id: this.state.id,
      name : value
    }
    this.setState({search: value});
    Plans.actions.locations.request(params).then(res => {
      if (res.data) {
        this.layer.clearLayers();
        res.data.forEach(item => {
          this.updateMarkers(item);
          this.map.setView(item.locations[0],3, {pan:{ animate:true}});
        });
      }
    })
  }
  render() {
    const items=[];
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    this.state.data.map((item) =>
      items.push({label: item.title,post_id: item.post_id})
    );
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">{this.Truncate(this.state.title)}</span>
            </h2>
            <div className="search-input">
              <ReactAutocomplete
                getItemValue={(item) => item.label}
                items={items}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={item => item.label}
                renderItem={(item, highlighted) =>
                  <div
                    key={item.id}
                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent',padding: '10px',fontSize: '16px'}}
                  >
                    {item.label}
                  </div>
                }
                value={this.state.search}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                inputProps={{ placeholder: 'Nhập từ khóa tìm kiếm' }}
              />
            </div>
          </div>
          <div className="content custom-procedure">
            <div id="map"></div>
          </div>
        </div>
      </CommonLayout>
    );
  }
}
ViewMapPlan.contextTypes = {
  router: React.PropTypes.object
};

const bindStateToProps = (state) => {
  return {
    plans: state.plans || []
  }
}

export default connect(bindStateToProps)(ViewMapPlan);
