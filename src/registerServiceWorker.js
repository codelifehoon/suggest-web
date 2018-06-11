import axios from "axios/index";
import * as Config from "./product/util/Config";


const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);



function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              console.log('New content is available; please refresh.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}



function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');


    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateSubscriptionOnServer(subscrciption) {
    // TODO: Send subscription to application server

    const jsonValue = {
        endPoint: JSON.stringify(subscrciption),
    }
    axios.post(Config.API_URL + '/Subscription/V1/modifyPushSubscription'
        ,jsonValue
        , {withCredentials: true, headers: {'Content-Type': 'application/json'}}
    )
        .then(res => { console.log(res.data)})
        .catch(err => { console.error('>>>> :' + err); });
}



export default function register() {
    if ( process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {

        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
            return;
        }
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // This is running on localhost. Lets check if a service worker still exists or not.
                checkValidServiceWorker(swUrl);

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'This web app is being served cache-first by a service ' +
                        'worker. To learn more, visit https://goo.gl/SC7cgQ'
                    );

                });
            } else {
                // Is not local host. Just register service worker
                registerValidSW(swUrl);
            }
        });

    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
        });
    }
}

//  function complite callback();
export function unsubscribeUser(callback) {
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription()
            .then(function (subscription) {
                if (subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function (error) {
                console.log('Error unsubscribing', error);
            })
            .then(function () {
                updateSubscriptionOnServer(null);
                if (callback) callback();


            });
    });
}



//  function complite callback(boolean);
export function chgeckSubscribed(callback) {
    // Set the initial subscription value
    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription()
            .then(function (subscription) {

                if (callback)  callback(true);

            }).catch(function(err) {
            console.log('chgeckSubscribed : '+ err);
                 if (callback) callback(false);

        });
    });
}


//  function complite callback(msg);
export function subscribeUser(callback) {
    const applicationServerPublicKey = 'BMRQd_C2NL8RDqrbxqHweX3g32j218yub56JjM8mE1A3I8jweO9MBBtfR65jHjhKrNOOeFhZx3bp2majGlN68qk';

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    const serverKeyJosn = {
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    };

    // 개발 환경일때에는 서비스 worker 등록을 안했기기에 업데이트 실행
    if (process.env.NODE_ENV === 'development' )  {
        let subscription = 'local';
        updateSubscriptionOnServer(subscription)
        if (callback)  callback(subscription);


    }

    navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.subscribe(serverKeyJosn)
            .then(function (subscription) {
                updateSubscriptionOnServer(subscription);
                if (callback)  callback(subscription);

            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
                if (callback)  callback(null);

            });
    }).catch(function (err) {
        console.log('Failed to serviceWorker.ready : ', err);

    });


    console.log("end subscribeUser");

}
