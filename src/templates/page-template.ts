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

    constructor(
        templateID:string, 
        templateNameEng:string,
        templateNameSwe:string,
        filePath:string, 
        pageNameConstatsFilePath:string, 
        adminFilePath:string,
        csprojFilePath:string) {
            this.templateID = templateID;
            this.templateNameEng = templateNameEng
            this.templateNameSwe = templateNameSwe
            this.pageTemplateFilePath = filePath
            this.pageTemplatefileName = templateID + this.pageTemplateFileExt + ".cs"
            this.className = templateID + this.pageTemplateFileExt
            this.pageNameConstantsFilePath = pageNameConstatsFilePath
            this.adminFilePath = adminFilePath
            this.csprojFilePath = csprojFilePath
    }

    async updateAdmin() {
        if(!await fs.pathExists(this.adminFilePath)) throw new Error(
            "File path missing: " + this.adminFilePath
        )

        var fieldDefinitionEng = 
`  <data name="fieldtemplate.websitearea.${this.templateID.toLowerCase()}.name" xml:space="preserve">
    <value>${this.templateNameEng}</value>
  </data>
  <data name="fieldtemplate.websitearea.${this.templateID.toLowerCase()}.fieldgroup.general.name" xml:space="preserve">
    <value>General</value>
  </data>
</root>
`

        var fieldDefinitionSwe = 
`  <data name="fieldtemplate.websitearea.${this.templateID.toLowerCase()}.name" xml:space="preserve">
    <value>${this.templateNameSwe}</value>
  </data>
  <data name="fieldtemplate.websitearea.${this.templateID.toLowerCase()}.fieldgroup.general.name" xml:space="preserve">
    <value>Allmänt</value>
  </data>
</root>
`

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
        var template = 
`using System.Collections.Generic;
using Litium.Accelerator.Constants;
using Litium.FieldFramework;
using Litium.Websites;

namespace Litium.Accelerator.Definitions.Pages
{
    internal class ${this.className} : FieldTemplateSetup
    {
        public override IEnumerable<FieldTemplate> GetTemplates()
        {
            var templates = new List<FieldTemplate>
            {
                new PageFieldTemplate(PageTemplateNameConstants.${this.templateID})
                {
                    TemplatePath = "",
                    FieldGroups = new []
                    {
                        new FieldTemplateFieldGroup()
                        {
                            Id = "General",
                            Collapsed = false,
                            Fields =
                            {
                                SystemFieldDefinitionConstants.Name,
                                SystemFieldDefinitionConstants.Url,
                            }
                        }
                    }
                },
            };
            return templates;
        }
    }
}`
        if(!await fs.pathExists(this.pageTemplateFilePath)) throw new Error(
            "File path missing: " + this.pageTemplateFilePath
        )

        await fs.outputFile(this.pageTemplateFilePath + this.pageTemplatefileName, template)
    }
}

export default PageTemplate