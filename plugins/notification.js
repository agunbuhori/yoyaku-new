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
      var url = 'https://m.yoyaku.id/queue';
      
      event.notification.close();

      event.waitUntil(
        clients.openWindow(url)
      );
      // clients.openWindow("https://m.yoyaku.id/queue");
  });
}