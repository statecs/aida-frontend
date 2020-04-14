import apiKey from '../keys/apiKey';

const _removePunctuation = (str: string) => str.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|’|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, '');

const CloudSpeechAPI = {
  ApiKey: apiKey,

  compareWith(score: number, phrase: string, expects: string) {
    phrase  = _removePunctuation(phrase).toLowerCase();
    expects = _removePunctuation(expects).toLowerCase();

    console.log(`Matching '${phrase}' with '${expects}'`);

    const result: number = (score > 0.5 && phrase === expects) ? score : 0;
    return result;
  },

  /*
   * blob: base 64 encoded FLAC audio file as blob
   * sampleRate: audio sample rate, ex: 44100
   * language: language code, ex: en-US
   * alternatives: number of possible alternatives to display
   */
  sendRequest (blob: Blob, sampleRate: string, language: string, alternatives: number = 1) {
    return new Promise((resolve, reject) => {
      // use FileReader to convert Blob to base64 encoded data-URL
      const reader = new FileReader();

      reader.readAsDataURL(blob);
 
      reader.addEventListener('load', () => {
        let data = undefined;
        //only use base64-encoded data, i.e. remove meta-data from beginning:
        const audioData = reader.result.replace(/^data:audio\/wav;base64,/, '');


        data = {
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: sampleRate,
            languageCode: language,
            maxAlternatives: alternatives,
          },
          audio: { content: audioData },
        };

        let url = 'https://speech.googleapis.com/v1/speech:recognize';
        url = url + `?key=${this.ApiKey}`;

        fetch(url, {
          body: JSON.stringify(data),
          method: 'POST',
          mode: 'cors',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        })
        .catch(ex => {
          console.error(ex);
          reject();
        });
      });
    })
  }
};

export default CloudSpeechAPI;