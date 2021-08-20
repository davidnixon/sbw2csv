import agent from 'superagent';
import lodash from 'lodash';

export default {
  add(event, navigator) {
    var nav = lodash.pick(navigator, [
      'deviceMemory',
      'hardwareConcurrency',
      'language',
      'userAgent',
      'userAgentData',
      'vendor',
      'maxTouchPoints',
    ]);
    agent
      .post('/services/analytics')
      .send({ browser: nav, event: { ...event, time: Date.now() } })
      .then(() => {
        // console.log('analytics');
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
