export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    service: "Venturo Health",
    status: "running",
    timestamp: new Date().toISOString()
  });
}
