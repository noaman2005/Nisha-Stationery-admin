import { Category } from "@/models/Category";
import mongooseConnect from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
    }

    if (method === 'POST') {
        const { name, parentCategory, properties } = req.body;

        // If parentCategory is an empty string, set it to null
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory && parentCategory !== "" ? parentCategory : null,
            properties,
        });

        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const { name, parentCategory, properties, _id } = req.body;

        // If parentCategory is an empty string, set it to null
        const categoryDoc = await Category.updateOne(
            { _id },
            {
                name,
                parent: parentCategory && parentCategory !== "" ? parentCategory : null,
                properties,
            }
        );

        res.json(categoryDoc);
    }

    if (method === 'DELETE') {
        const { _id } = req.query;
        await Category.deleteOne({ _id });
        res.json('ok');
    }
}