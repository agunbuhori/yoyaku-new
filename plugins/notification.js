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
    self.addEventListener('notificationclick', function (event) {
      var url = event.notification.data.redirectUrl;

      event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
      // clients.openWindow("https://m.yoyaku.id/queue");
  });
}