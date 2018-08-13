self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let options = JSON.parse(event.data.text());
    options.data =  options.body ;                        // notificationclick ����� ���ؼ� orginal body �������� ����
    options.body = JSON.parse(options.body).message;    //server���� option�� ������ format���� ����
                                                        // ��  body�� �߰� ������ ���� �ϱ� ���ؼ� json���·� message,link�� ����


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