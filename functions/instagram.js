const axios = require('axios');

exports.handler = (event, context, callback) => {
  axios.get(process.env.API_INSTAGRAM_URL, {
    params: {
      access_token: process.env.API_INSTAGRAM_KEY,
    },
  })
    .then(({ data, }) => {
      return data.data.map((post) => {
        let images;
        if (post.type === 'carousel') {
          images = post.carousel_media.map((image) => {
            return image.images.standard_resolution;
          });
        } else {
          images = post.images.standard_resolution;
        }
        return {
          images,
          caption: post.caption ? post.caption.text : '',
          tags: post.tags,
        };
      });
    })
    .then((data) => {
      return JSON.stringify(data);
    })
    .then((data) => {
      callback(null, {
        statusCode: 200,
        body: data,
      });
    })
    .catch((error) => {
      callback(error);
    });
};
