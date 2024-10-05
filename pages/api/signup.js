import { connectDatabase, insertDocument } from "../../helpers/db-util";

export default async function handler(request, response) {
  if (request.method === "POST") {
    const userEmail = request.body.email;
    if (!userEmail || !userEmail.includes("@")) {
      response.status(422).json({ message: "Invalid email address" });
      return;
    }
    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      response
        .status(500)
        .json({ message: "Connecting to the database failed!" });
      return;
    }
    try {
      await insertDocument(client, "emails", { email: userEmail });
      client.close();
    } catch (error) {
      response.status(500).json({ message: "Inserting data failed!" });
      return;
    }

    response.status(201).json({ message: "Signed up!" });
  }
}
