export default async function handler(req, res) {
 console.log('?? [PING] Endpoint hit!');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ ok: true, message: 'PING OK' });
}