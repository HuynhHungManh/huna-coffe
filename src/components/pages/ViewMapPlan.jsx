import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';
import {Plans} from 'api';
import L from 'leaflet';
import 'react-leaflet-fullscreen/dist/styles.css';
import { Map, ImageOverlay, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FullscreenControl from 'react-leaflet-fullscreen';

class ViewMapPlan extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      title: '',
      urlFile: '',
      isOpen: false,
      draggable: false,
      position: [100,100]
    };
  }

  componentDidMount() {
    let file = this.props.plans.find((item) => item.id == this.props.match.params.id);
    this.setState({
      title: file && file.title && file.title.rendered ? file.title.rendered : '',
    })
    this.setState({
      urlFile: file && file.acf && file.acf.map_plan && file.acf.map_plan.url || ''
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
    this.setState({
      position: [tempLatLng.lat, tempLatLng.lng]
    });
  };

  render() {
    let images = [
      { src: this.state.urlFile }
    ];
    const bounds = [[0, 0], [1000, 1000]];
    const customIcon = L.icon({
      iconSize: [60,90]
    });
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">{this.Truncate(this.state.title)}</span>
            </h2>
          </div>
          <div className="content custom-procedure">
            <div>
              <Map zoom={16}
                crs={ L.CRS.Simple }
                bounds={ bounds }
                id='mapContainer'
                >
                <ImageOverlay url={this.state.urlFile} bounds={ bounds } />
                <FullscreenControl position="topright" titleCancel="Cancel" />
              </Map>

              { !this.state.urlFile &&
                <p className="notification-empty">Bạn chưa cập nhập file biểu mẫu cho tệp biểu mẫu này !</p>
              }
            </div>
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
