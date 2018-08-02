const MediaRecorder = Target => {
    const constraints = {audio: true};
    return class MediaRecorderClass extends Target {
        constructor() {
            super();
            this.compatibility();
        }

        startAudio() {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                console.log(stream);
            })
        }

        /**
         * @author j_bleach 2018/08/02 17:06
         * @describe 浏览器navigator.mediaDevices兼容性处理
         */
        compatibility() {
            const promisifiedOldGUM = (constraints) => {
                // First get ahold of getUserMedia, if present
                const getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error('getUserMedia is not implemented in this browser')
                    );
                }
                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };

            // Older browsers might not implement mediaDevices at all, so we set an empty object first
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            // Some browsers partially implement mediaDevices. We can't just assign an object
            // with getUserMedia as it would overwrite existing properties.
            // Here, we will just add the getUserMedia property if it's missing.
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
            }
        }
    }
}
export default MediaRecorder;