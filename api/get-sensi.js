export default async function handler(req, res) {
  // Directly return a simple, guaranteed JSON object
  return res.status(200).json({ text: "Server is working perfectly!" });
}
