module.exports = async function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "Venturo API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
};