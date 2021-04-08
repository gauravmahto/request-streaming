import { randomChars, hasStreamingRequestSupport } from './utils.js';

console.log('main.js loaded');

let interval;

/** 
 * @param {ReadableStreamController<any>} controller
 */
const getEndTestHandler = (controller) => /** @param {MouseEvent} event */ function cb(event) {

  if (event.currentTarget.classList.contains('sending')) {

    console.log('Stopping streaming request...');

    clearInterval(interval);
    controller.close();

    event.currentTarget.classList.remove('sending');
    event.currentTarget.value = 'Send';

    event.target.removeEventListener('click', cb);

  }

};

const getReadableStream = () => new ReadableStream({
  start(controller) {
    interval = setInterval(() => {
      let string = randomChars();

      // Add the string to the stream
      controller.enqueue(string);

    }, 1000);

    window.document.querySelector('input#send').addEventListener('click', getEndTestHandler(controller));
  },
  pull(controller) {
    // We don't really need a pull in this example
  },
  cancel() {
    // This is called if the reader cancels,
    // so we should stop generating strings
    clearInterval(interval);
  }
}).pipeThrough(new TextEncoderStream());

/**
 * @param {MouseEvent} event 
 */
const startTest = (event) => {

  if (event.currentTarget.classList.contains('sending')) {

    return;

  }

  console.log('Starting streaming request...');

  event.currentTarget.value = 'Stop';
  event.currentTarget.classList.add('sending');

  fetch('/input-data', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    allowHTTP1ForStreamingUpload: true,
    body: getReadableStream()
  });

};

window.onload = () => {

  console.log('Test - ', hasStreamingRequestSupport() ? 'Has streaming request support.' : 'No streaming request support.');

  window.document.querySelector('input#send').addEventListener('click', startTest);

};
