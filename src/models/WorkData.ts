export interface DayEntry {
  hours: number;
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  breakMinutes?: number;
  notes?: string;
}

export interface MonthData {
  [day: number]: DayEntry;
}

export interface Company {
  id: string;
  name: string;
  hourlyRate: number;
  workData: { [monthKey: string]: MonthData };
}

export interface WorkDataJSON {
  companies: Company[];
  activeCompanyId: string;
}

export class WorkData {
  companies: Company[];
  activeCompanyId: string;

  constructor(companies: Company[] = [], activeCompanyId: string = "") {
    this.companies = companies;
    this.activeCompanyId = activeCompanyId;

    // Ensure at least one company exists
    if (this.companies.length === 0) {
      const defaultCompany: Company = {
        id: "default",
        name: "Company 1",
        hourlyRate: 0,
        workData: {},
      };
      this.companies.push(defaultCompany);
      this.activeCompanyId = "default";
    }
  }

  static fromJson(json: any): WorkData {
    // Migration from old single-company format
    if (json.hourlyRate !== undefined && json.workData !== undefined) {
      const defaultCompany: Company = {
        id: "default",
        name: "Company 1",
        hourlyRate: json.hourlyRate,
        workData: json.workData,
      };
      return new WorkData([defaultCompany], "default");
    }

    return new WorkData(json.companies || [], json.activeCompanyId || "");
  }

  toJson(): WorkDataJSON {
    return {
      companies: this.companies,
      activeCompanyId: this.activeCompanyId,
    };
  }

  get activeCompany(): Company {
    return (
      this.companies.find((c) => c.id === this.activeCompanyId) ||
      this.companies[0]
    );
  }

  getEntry(year: number, month: number, day: number): DayEntry {
    const key = this.monthKey(year, month);
    return this.activeCompany.workData[key]?.[day] || { hours: 0 };
  }

  getHours(year: number, month: number, day: number): number {
    return this.getEntry(year, month, day).hours;
  }

  setEntry(year: number, month: number, day: number, entry: DayEntry) {
    const key = this.monthKey(year, month);
    if (!this.activeCompany.workData[key]) {
      this.activeCompany.workData[key] = {};
    }

    if (entry.hours > 0 || entry.startTime || entry.endTime) {
      this.activeCompany.workData[key][day] = entry;
    } else {
      delete this.activeCompany.workData[key][day];
    }
  }

  getTotalHours(year: number, month: number): number {
    const key = this.monthKey(year, month);
    const monthData = this.activeCompany.workData[key];
    if (!monthData) return 0;

    return Object.values(monthData).reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
  }

  getSalary(year: number, month: number): number {
    return this.getTotalHours(year, month) * this.activeCompany.hourlyRate;
  }

  updateHourlyRate(rate: number) {
    this.activeCompany.hourlyRate = rate;
  }

  addCompany(name: string, rate: number = 0): string {
    const id = Date.now().toString();
    this.companies.push({
      id,
      name,
      hourlyRate: rate,
      workData: {},
    });
    return id;
  }

  setActiveCompany(id: string) {
    if (this.companies.some((c) => c.id === id)) {
      this.activeCompanyId = id;
    }
  }

  deleteCompany(id: string) {
    if (this.companies.length <= 1) return; // Must have at least one company

    const index = this.companies.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.companies.splice(index, 1);

      // If we deleted the active company, switch to the first available one
      if (this.activeCompanyId === id) {
        this.activeCompanyId = this.companies[0].id;
      }
    }
  }

  getRecentHistory(
    months: number = 6
  ): { label: string; hours: number; salary: number }[] {
    const history = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const hours = this.getTotalHours(year, month);
      const salary = this.getSalary(year, month);

      history.push({
        label: d.toLocaleString("default", { month: "short" }),
        hours,
        salary,
      });
    }
    return history;
  }
  private monthKey(year: number, month: number): string {
    return `${year}-${month.toString().padStart(2, "0")}`;
  }
}
