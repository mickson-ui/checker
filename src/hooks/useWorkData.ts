import { useState, useEffect } from "react";
import { WorkData } from "../models/WorkData";
import { StorageService } from "../services/storage";

export function useWorkData() {
  const [workData, setWorkData] = useState<WorkData>(new WorkData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const data = await StorageService.loadData();
      setWorkData(data);
      setIsLoading(false);
    }
    init();
  }, []);

  const updateHourlyRate = async (rate: number) => {
    const newData = new WorkData(workData.companies, workData.activeCompanyId);
    newData.updateHourlyRate(rate);
    setWorkData(newData);
    await StorageService.saveData(newData);
  };

  const setEntry = async (
    year: number,
    month: number,
    day: number,
    hours: number,
    startTime?: string,
    endTime?: string,
    breakMinutes?: number,
    notes?: string
  ) => {
    const newData = new WorkData(
      [...workData.companies],
      workData.activeCompanyId
    );
    newData.setEntry(year, month, day, {
      hours,
      startTime,
      endTime,
      breakMinutes,
      notes,
    });
    setWorkData(newData);
    await StorageService.saveData(newData);
  };

  const addCompany = async (name: string, rate: number = 0) => {
    const newData = new WorkData(
      [...workData.companies],
      workData.activeCompanyId
    );
    const newId = newData.addCompany(name, rate);
    newData.setActiveCompany(newId);
    setWorkData(newData);
    await StorageService.saveData(newData);
  };

  const switchCompany = async (id: string) => {
    const newData = new WorkData(
      [...workData.companies],
      workData.activeCompanyId
    );
    newData.setActiveCompany(id);
    setWorkData(newData);
    await StorageService.saveData(newData);
  };

  const renameCompany = async (id: string, newName: string) => {
    const newData = new WorkData(
      [...workData.companies],
      workData.activeCompanyId
    );
    const company = newData.companies.find((c) => c.id === id);
    if (company) {
      company.name = newName;
      setWorkData(newData);
      await StorageService.saveData(newData);
    }
  };

  const deleteCompany = async (id: string) => {
    const newData = new WorkData(
      [...workData.companies],
      workData.activeCompanyId
    );
    newData.deleteCompany(id);
    setWorkData(newData);
    await StorageService.saveData(newData);
  };

  return {
    workData,
    isLoading,
    updateHourlyRate,
    setEntry,
    addCompany,
    switchCompany,
    renameCompany,
    deleteCompany,
  };
}
