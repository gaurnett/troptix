export default async function handler(request, response) {
  return response.status(200).json({ message: 'Hello World' });
}
