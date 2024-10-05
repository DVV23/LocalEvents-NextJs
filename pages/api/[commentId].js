import { MongoClient } from "mongodb";
import {
  connectDatabase,
  getAllDocuments,
  insertDocument,
} from "../../helpers/db-util";
export default async function handler(request, response) {
  const commentId = request.query.commentId;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    response.status(500).json({ message: "Failed connecting to database" });
    return;
  }
  if (request.method === "POST") {
    // add server-side validation
    const { email, name, comment } = request.body;
    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !comment ||
      comment.trim() === ""
    ) {
      response.status(422).json({ message: "Invalid input" });
      client.close();
    }
    const newComment = {
      email,
      name,
      comment,
      commentId,
    };
    let result;
    try {
      result = await insertDocument(client, "emails", newComment);
      newComment._id = result.insertedId;
      response.status(201).json({ message: "Added comment", newComment });
    } catch (erorr) {
      response.status(500).json({ message: "Inserting comment failed!" });
    }
  }
  if (request.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", { _id: -1 });
      response.status(200).json({ comments: documents });
    } catch (error) {
      response.status(500).json({ message: "Getting comments failed!" });
    }
  }
  client.close();
}
