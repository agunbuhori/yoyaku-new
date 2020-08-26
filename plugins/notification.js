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
      if (clients.openWindow && event.notification.data.url) {
          event.waitUntil(clients.openWindow('https://m.yoyaku.id/queue'));
      }
      // clients.openWindow("https://m.yoyaku.id/queue");
  });
}