export default async function ({$axios}) {
    window.Notification.requestPermission();

    const _vn = this;

    navigator.serviceWorker.getRegistration().then(function(reg) {  
      let count = 10;
      setInterval(() => {
        $axios.$get('/check_notification').then(response => {
          if (response.show)
            reg.showNotification(response.message);
        })
      }, 10000);
    });
    self.onnotificationclick = function(event) {
      console.log('On notification click: ', event.notification.tag);
      event.notification.close();
    
      // This looks to see if the current is already open and
      // focuses if it is
      event.waitUntil(clients.matchAll({
        type: "window"
      }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == 'https://m.yoyaku.id/queue' && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow)
          return clients.openWindow('https://m.yoyaku.id/queue');
      }));
    }
  //   self.addEventListener('notificationclick', function (event) {
  //     var url = 'https://m.yoyaku.id/queue';
      
  //     event.notification.close();

  //     event.waitUntil(
  //       clients.openWindow(url)
  //     );
  //     // clients.openWindow("https://m.yoyaku.id/queue");
  // });
}