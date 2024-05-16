import CompanyModel from "./company.model";
import Company from "./company.interface";
import HttpException from "../../utils/exceptions/http.exception";
import Token from "../../utils/interfaces/token.interface";
import UserModel from "../user/user.model";
import User from "../user/user.interface";
import { UpdateWriteOpResult } from "mongoose";
class CompanyService {
  private company = CompanyModel;
  private user = UserModel;

  public async create(
    company: Company,
    token: String
  ): Promise<Company | Error> {
    const companyCreator = await this.user.findOne({ token: token });
    if (!companyCreator) {
      throw new HttpException(400, "User not found");
    }
    company.companyCreator = companyCreator._id;
    console.log(company);
    const createdCompany = await this.company.create(company);
    return createdCompany;
  }

  public async deleteCompany(id: string): Promise<String | HttpException> {
    const deletedCompany = await this.company.deleteOne({ _id: id });
    if (deletedCompany.deletedCount <= 0)
      throw new HttpException(400, "Company not deleted");
    return String("company deleted: " + Boolean(deletedCompany.deletedCount));
  }

  public async updateCompany(
    company: Company
  ): Promise<Company | HttpException> {
    const updatedCompany = (await this.company.findOneAndUpdate(
      { _id: company._id },
      company,
      { new: true }
    )) as Company;
    if (!updatedCompany) {
      throw new HttpException(400, "Company not updated");
    }

    return updatedCompany;
  }
  public async getCompany(id: string): Promise<Company | Error> {
    const getCompany = await this.company.findOne({ _id: id });
    if (!getCompany) {
      throw new HttpException(400, "Company not found");
    }
    return getCompany;
  }
}
export default CompanyService;
