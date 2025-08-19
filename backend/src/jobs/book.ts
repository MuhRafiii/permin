import cron from "node-cron";
import { supabase } from "../supabase/supabaseClient";

export const startReleaseReservationsJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running releaseReservations job...");

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { error } = await supabase
      .from("books")
      .update({
        status: "available",
        reserved_by: null,
        reserved_at: null,
      })
      .lte("reserved_at", threeDaysAgo.toISOString())
      .eq("status", "reserved");

    if (error) {
      console.error("Failed to release reservations:", error.message);
    } else {
      console.log("Expired reservations released");
    }
  });
};
