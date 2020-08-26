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
    self.addEventListener("notificationclick", (event) => {
        event.waitUntil(async function () {
            const allClients = await clients.matchAll({
                includeUncontrolled: true
            });
            let chatClient;
            let appUrl = 'https://m.yoyaku.id/queue';
            for (const client of allClients) {
            //here appUrl is the application url, we are checking it application tab is open
                if(client['url'].indexOf(appUrl) >= 0) 
                {
                    client.focus();
                    chatClient = client;
                    break;
                }
            }
            if (!chatClient) {
                chatClient = await clients.openWindow(appUrl);
            }
        }());
    });
  //   self.addEventListener('notificationclick', function (event) {
  //     var url = 'https://m.yoyaku.id/queue;
      
  //     event.notification.close();

  //     event.waitUntil(
  //       clients.openWindow(url)
  //     );
  //     // clients.openWindow("https://m.yoyaku.id/queue");
  // });
}