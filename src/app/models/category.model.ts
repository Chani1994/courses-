export class Category {
  public code: string;
  public name: string;
  public iconPath: string;

  constructor(code: string, name: string, iconPaths: string) {
    this.code = code;
    this.name = name;
    this.iconPath= iconPaths;
  }
}

