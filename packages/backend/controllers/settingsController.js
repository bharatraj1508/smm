import Settings from "../models/settings.js";
import { StatusCode } from "status-code-enum";

class SettingsController {
  async getSettings(req, res) {
    try {
      let settings = await Settings.findOne({ userId: req.userId });
      if (!settings) {
        settings = await Settings.create({ userId: req.userId });
      }
      res.status(StatusCode.SuccessOK).json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res
        .status(StatusCode.ServerErrorInternal)
        .json({ message: error.message });
    }
  }

  async updateSettings(req, res) {
    try {
      const { automaticSync } = req.body;
      const settings = await Settings.findOneAndUpdate(
        { userId: req.userId },
        { automaticSync },
        { new: true, upsert: true },
      );
      res.status(StatusCode.SuccessOK).json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res
        .status(StatusCode.ServerErrorInternal)
        .json({ message: error.message });
    }
  }
}

export default new SettingsController();
