import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { WorkData, Company } from "../models/WorkData";
import { format } from "date-fns";

export const ReportService = {
  async generateMonthlyPDF(
    company: Company,
    year: number,
    month: number,
    totalHours: number,
    salary: number
  ) {
    const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
    const monthData = company.workData[monthKey] || {};
    const date = new Date(year, month - 1);
    const monthName = format(date, "MMMM yyyy");

    const formatDuration = (decimalHours: number) => {
      if (decimalHours === 0) return "0";
      const totalMinutes = Math.round(decimalHours * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}:${m.toString().padStart(2, "0")}`;
    };

    const rows = Object.entries(monthData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(
        ([day, entry]) => `
        <tr>
          <td>${day}.</td>
          <td>${entry.startTime || "--:--"}</td>
          <td>${entry.endTime || "--:--"}</td>
          <td>${entry.breakMinutes || 0}m</td>
          <td><strong>${formatDuration(entry.hours)}h</strong></td>
          <td><small>${entry.notes || ""}</small></td>
        </tr>
      `
      )
      .join("");

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
            h1 { color: #14FFEC; }
            .header { border-bottom: 2px solid #eee; margin-bottom: 20px; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            th { background-color: #f9f9f9; color: #666; font-size: 12px; text-transform: uppercase; }
            .summary { background-color: #f0fbfa; padding: 20px; border-radius: 10px; margin-top: 30px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total-val { font-weight: bold; font-size: 18px; color: #14FFEC; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Work Hours Report</h1>
            <p><strong>Company:</strong> ${company.name}</p>
            <p><strong>Period:</strong> ${monthName}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Start</th>
                <th>End</th>
                <th>Break</th>
                <th>Hours</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="summary">
            <div class="total-row">
              <span>Total Hours:</span>
              <span class="total-val">${formatDuration(totalHours)}h</span>
            </div>
            <div class="total-row">
              <span>Total Salary:</span>
              <span class="total-val">${
                company.hourlyRate > 0 ? salary.toFixed(2) : "--"
              }</span>
            </div>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  },

  async generateCSV(company: Company, year: number, month: number) {
    const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
    const monthData = company.workData[monthKey] || {};

    let csv = "Date,StartTime,EndTime,BreakMin,Hours,Notes\n";

    Object.entries(monthData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([day, entry]) => {
        csv += `${year}-${month}-${day},${entry.startTime || ""},${
          entry.endTime || ""
        },${entry.breakMinutes || 0},${entry.hours},"${(
          entry.notes || ""
        ).replace(/"/g, '""')}"\n`;
      });

    // In a real app we'd save this to a file and share it. For now let's just focus on PDF as it's more requested.
    return csv;
  },
};
