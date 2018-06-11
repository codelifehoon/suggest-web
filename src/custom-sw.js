self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let options = JSON.parse(event.data.text());
    options.data =  options.body ;                        // notificationclick 사용을 위해서 orginal body 정보에서 복사
    options.body = JSON.parse(options.body).message;    //server에서 option과 동일한 format으로 전송
                                                        // 단  body는 추가 정보를 전달 하기 위해서 json형태로 message,link로 전달


    event.waitUntil(self.registration.showNotification(options.title, options));
});

self.addEventListener('notificationclick', (e) => {

    console.log(e);
    var notification = e.notification;
    //var primaryKey = notification.data.primaryKey;

    var action = e.action;
    var data = JSON.parse(notification.data);

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow(data.link);
        notification.close();
    }
});