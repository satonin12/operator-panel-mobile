import RNFetchBlob from "rn-fetch-blob";

/*
* data base64
* TODO: select folder as parameter
* */
export const uploadImageInCloudniary = async (data) => {
  return RNFetchBlob.fetch(
    'POST',
    'https://api.cloudinary.com/v1_1/dyjcgnzq7/image/upload?upload_preset=operators_uploads&folder=mobile_image',
    {
      'content-type': 'multipart/form-data'
    },
    [
      {
        name: 'file',
        filename: 'template_name.jpg',
        data: data
      }
    ]
  );
}
