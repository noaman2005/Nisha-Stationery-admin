import {Product} from "@/models/Product";
import mongooseConnect from "@/pages/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({_id:req.query.id}));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === 'POST') {
        try {
            const {title, description, price, images, category, properties} = req.body;
            const productDoc = await Product.create({
                title, description, price, images, category, properties,
            });
            res.json(productDoc);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    if (method === 'PUT') {
        const {title,description,price,images,category,properties,_id} = req.body;
        await Product.updateOne({_id}, {title,description,price,images,category,properties});
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}