export default class Project {
    private readonly rootDir:string = ""
    private readonly name:string = ""
    private readonly pageTemplateFilePath:string = 'Src/Litium.Accelerator/Definitions/Pages/'
    private readonly adminFilePath:string = 'Src/Litium.Accelerator.Mvc/Site/Resources/Administration/'
    private readonly pageNameConstantsFilePath:string = 'Src/Litium.Accelerator/Constants/PageTemplateNameConstants.cs'
    private readonly csprojFilePath:string = 'Src/Litium.Accelerator/Litium.Accelerator.csproj'
    
    constructor(
        rootDir?:string, 
        name?:string, 
        pageTemplateFilePath?:string, 
        adminFilePath?:string, 
        pageNameConstantsFilePath?:string,
        csprojFilePath?:string) {
        if(rootDir)
            this.rootDir = rootDir
        if(name)
            this.name = name
        if(pageTemplateFilePath) 
            this.pageTemplateFilePath = pageTemplateFilePath
        if(adminFilePath)
            this.adminFilePath = adminFilePath
        if(pageNameConstantsFilePath) 
            this.pageNameConstantsFilePath = pageNameConstantsFilePath
        if(csprojFilePath)
            this.csprojFilePath = csprojFilePath
    }

    getName() : string {
        return this.name
    }

    getRootDir() : string {
        return this.rootDir
    }

    getPageTemplateFilePath() : string {
        return this.rootDir + this.pageTemplateFilePath
    }

    getAdminFilePath() : string {
        return this.rootDir + this.adminFilePath
    }

    getCsprojFilePath() : string {
        return this.rootDir + this.csprojFilePath
    }

    getPageNameConstantsFilePath() : string {
        return this.rootDir + this.pageNameConstantsFilePath
    }

    static fromJSON(d: Object): Project {
        return Object.assign(new Project(), d);
    }
}