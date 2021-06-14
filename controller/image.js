const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_KEY);

const handleApiCall = (req, res) => {
   const { url } = req.body   
   
    stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "bd367be194cf45149e75f01d59f77ba7",
        inputs: [{data: {image: {url: url }}}]
    },
    metadata,
    (err, response) => {

        if (err) {            
           return res.status(400).json("Error");
        }

        if (response.status.code !== 10000) {
   
          return res.status(400).json("failed");
        }
        
        return res.json(response.outputs[0].data.concepts)

        // console.log("Predicted concepts, with confidence values:")
        // for (const c of response.outputs[0].data.concepts) {           
        //     // return res.json(c.name + ": " + c.value)
        //     return res.json(c)
            
        // }
    }
);
}

module.exports =  {
    handleApiCall
}