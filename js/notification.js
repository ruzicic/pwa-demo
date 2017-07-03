((window) => {
    // https://auth0.com/blog/introduction-to-progressive-web-apps-push-notifications-part-3/

    // Push notification button
    const fabPushElement = document.querySelector('.fab__push');
    const fabPushImgElement = document.querySelector('.fab__image');

    const isPushSupported = () => {
        if (Notification.permission === 'denied') {
            console.warn(`User has blocked push notification.`);
            return;
        }

        if (!('PushManager' in window)) {
            console.warn(`Sorry, Push notification isn't supported in your browser.`);
            return;
        }

        navigator.serviceWorker.ready
            .then((registration) => {
                registration.pushManager.getSubscription()
                    .then((subscription) => {
                        if (subscription) {
                            changePushStatus(true);
                        }
                        else {
                            changePushStatus(false);
                        }
                    })
                    .catch((error) => {
                        console.error('Error occurred while enabling push ', error);
                    });
            });
    }

    // Ask User if he wants to subscribe to push notifications and then 
    // subscribe and send push notification
    const subscribePush = () => {
        navigator.serviceWorker.ready.then((registration) => {
            if (!registration.pushManager) {
                console.warn(`Your browser doesn't support push notification.`);
                return false;
            }

            // To subscribe `push notification` from push manager
            registration.pushManager.subscribe({
                userVisibleOnly: true // Always show notification when received
            })
                .then((subscription) => {
                    toast('Subscribed successfully.');
                    console.info('Push notification subscribed.');
                    console.log(subscription);
                    //saveSubscriptionID(subscription);
                    changePushStatus(true);
                })
                .catch((error) => {
                    changePushStatus(false);
                    console.error('Push notification subscription error: ', error);
                });
        })
    }

    // Unsubscribe the user from push notifications
    const unsubscribePush = () => {
        navigator.serviceWorker.ready
            .then((registration) => {
                //Get `push subscription`
                registration.pushManager.getSubscription()
                    .then((subscription) => {
                        // If no `push subscription`, then return
                        if (!subscription) {
                            console.error('Unable to unregister push notification.');
                            return;
                        }

                        // Unsubscribe `push notification`
                        subscription.unsubscribe()
                            .then(() => {
                                toast('Unsubscribed successfully.');
                                console.info('Push notification unsubscribed.');
                                console.log(subscription);
                                //deleteSubscriptionID(subscription);
                                changePushStatus(false);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    })
                    .catch((error) => {
                        console.error('Failed to unsubscribe push notification.');
                    });
            })
    }

    // To change status
    const changePushStatus = (status) => {
        fabPushElement.dataset.checked = status;
        fabPushElement.checked = status;
        if (status) {
            fabPushElement.classList.add('active');
            fabPushImgElement.src = './images/push-on.png';
        }
        else {
            fabPushElement.classList.remove('active');
            fabPushImgElement.src = './images/push-off.png';
        }
    }

    //Click event for subscribe push
    fabPushElement.addEventListener('click', () => {
        const isSubscribed = (fabPushElement.dataset.checked === 'true');
        if (isSubscribed) {
            unsubscribePush();
        }
        else {
            subscribePush();
        }
    });

    isPushSupported(); //Check for push notification support

})(window);