import * as fs from "fs-extra"

class PageTemplate {
    private readonly pageTemplateFileExt:string = "PageTemplateSetup"
    private readonly pageTemplatefileName:string
    private readonly templateID:string
    private readonly templateNameEng:string
    private readonly templateNameSwe:string
    private readonly pageTemplateFilePath:string
    private readonly className:string
    private readonly pageNameConstantsFilePath:string
    private readonly adminFilePath:string
    private readonly csprojFilePath:string
    private readonly fieldDefintionEngFile:string
    private readonly fieldDefintionSweFile:string
    private readonly templateFilePath:string



    constructor(
        templateID:string, 
        templateNameEng:string,
        templateNameSwe:string,
        filePath:string, 
        pageNameConstatsFilePath:string, 
        adminFilePath:string,
        csprojFilePath:string,
        fieldDefintionEngFile:string,
        fieldDefintionSweFile:string,
        templateFilePath:string) {
            this.templateID = templateID;
            this.templateNameEng = templateNameEng
            this.templateNameSwe = templateNameSwe
            this.pageTemplateFilePath = filePath
            this.pageTemplatefileName = templateID + this.pageTemplateFileExt + ".cs"
            this.className = templateID + this.pageTemplateFileExt
            this.pageNameConstantsFilePath = pageNameConstatsFilePath
            this.adminFilePath = adminFilePath
            this.csprojFilePath = csprojFilePath
            this.fieldDefintionEngFile = fieldDefintionEngFile
            this.fieldDefintionSweFile = fieldDefintionSweFile
            this.templateFilePath = templateFilePath
    }

    async updateAdmin() {
        if(!await fs.pathExists(this.adminFilePath)) throw new Error(
            "File path missing: " + this.adminFilePath
        )

        var fieldDefinitionEng = (await fs.readFile(this.fieldDefintionEngFile)).toString();
        fieldDefinitionEng = fieldDefinitionEng.replace("{templateID}", this.templateID.toLowerCase());
        fieldDefinitionEng = fieldDefinitionEng.replace("{templateNameEng}", this.templateNameEng);

        var fieldDefinitionSwe = (await fs.readFile(this.fieldDefintionSweFile)).toString();
        fieldDefinitionSwe = fieldDefinitionSwe.replace("{templateID}", this.templateID.toLowerCase());
        fieldDefinitionSwe = fieldDefinitionSwe.replace("{templateNameSwe}", this.templateNameSwe);

        var adminResx = await fs.readFile(this.adminFilePath + "Administration.resx")
        var newAdminResx = adminResx.toString().replace("</root>", "") + fieldDefinitionEng

        await fs.writeFile(
            this.adminFilePath + "Administration.resx",
            newAdminResx
        )

        var adminResxSwe = await fs.readFile(this.adminFilePath + "Administration.sv-se.resx")
        var newAdminResx = adminResxSwe.toString().replace("</root>", "") + fieldDefinitionSwe

        await fs.writeFile(
            this.adminFilePath + "Administration.sv-se.resx",
            newAdminResx
        )
    }

    async updatePageNameConstants() {
        if(!await fs.pathExists(this.pageNameConstantsFilePath)) throw new Error(
            "File path missing: " + this.pageNameConstantsFilePath
        )

        var constantFileContentArray = (await fs.readFile(this.pageNameConstantsFilePath))
            .toString()
            .split("\n");
        
        var indexForNewContent = constantFileContentArray.findIndex(content => content.includes("}"))
        
        constantFileContentArray.splice(indexForNewContent, 0, `        public const string ${this.templateID} = "${this.templateID}";`)

        await fs.writeFile(this.pageNameConstantsFilePath, constantFileContentArray.join("\n"))
    }

    async updateCsProj() {
        if(!await fs.pathExists(this.csprojFilePath)) throw new Error(
            "File path missing: " + this.csprojFilePath
        )
        var includeContent = `    <Compile Include="Definitions\\Pages\\${this.pageTemplatefileName}" />`
        var csproj = (await fs.readFile(this.csprojFilePath)).toString().split("\n")
        var indexForNewConent = csproj.findIndex(content => {
            return content.includes(`<Compile Include="Definitions\\Pages`) && includeContent > content
        })      

        csproj.splice(indexForNewConent, 0, includeContent)

        await fs.writeFile(this.csprojFilePath, csproj.join("\n"))
    }

    async createTemplateFile() {
        var template = (await fs.readFile(this.templateFilePath)).toString();
        template = template.replace(/{className}/gi, this.className);
        template = template.replace(/{templateID}/gi, this.templateID);

        if(!await fs.pathExists(this.pageTemplateFilePath)) throw new Error(
            "File path missing: " + this.pageTemplateFilePath
        )

        await fs.outputFile(this.pageTemplateFilePath + this.pageTemplatefileName, template)
    }
}

export default PageTemplate