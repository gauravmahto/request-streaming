console.log('utils.js loaded');

// function to generate random character string
export function randomChars() {

  let string = "";
  let choices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  for (let i = 0; i < 8; i++) {
    string += choices.charAt(Math.floor(Math.random() * choices.length));
  }

  return string;

}

export function hasStreamingRequestSupport() {

  const supportsRequestStreams = !new Request('', {
    body: new ReadableStream(),
    method: 'POST',
  }).headers.has('Content-Type');

  return supportsRequestStreams;

}
