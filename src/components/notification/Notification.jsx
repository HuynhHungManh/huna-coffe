// import React from 'react';
// import Alert from 'react-s-alert';
// import 'react-s-alert/dist/s-alert-default.css';
//
// class Notification extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     this.state = {
//       notification: '',
//       type: ''
//     }
//   }
//     handleClick1(e) {
//     e.preventDefault();
//     Alert.warning('<h1>Test message 1</h1>', {
//     position: 'top-right',
//     effect: 'scale',
//     onShow: function () {
//        console.log('aye!')
//     },
//     beep: false,
//     timeout: 'none',
//     offset: 100
//     });
//   }
//
//   render() {
//     return (
//       <div>
//         <button className='btn btn-info'
//           onClick={this.createNotification('info')}>Info
//         </button>
//         <hr/>
//         <button className='btn btn-success'
//           onClick={this.createNotification('success')}>Success
//         </button>
//         <hr/>
//         <button className='btn btn-warning'
//           onClick={this.createNotification('warning')}>Warning
//         </button>
//         <hr/>
//         <button className='btn btn-danger'
//           onClick={this.createNotification('error')}>Error
//         </button>
//
//         <NotificationContainer/>
//       </div>
//     );
//   }
// }
//
// export default Notification;
