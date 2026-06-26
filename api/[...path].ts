let app: any = null;
let startupError: any = null;

async function initApp() {
  if (app || startupError) return;
  try {
    const module = await import("../server.js");
    app = module.createApp();
  } catch (e: any) {
    startupError = {
      message: e.message,
      stack: e.stack
    };
  }
}

export default async (req: any, res: any) => {
  await initApp();
  if (startupError) {
    res.status(500).json({
      error: "Startup error in serverless function",
      message: startupError.message,
      stack: startupError.stack
    });
    return;
  }
  return app(req, res);
};

