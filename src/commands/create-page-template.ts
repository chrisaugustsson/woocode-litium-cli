import {Command, flags} from "@oclif/command"
import cli from "cli-ux"
import PageTemplate from "../templates/page-template"
import * as fs from "fs-extra"
import Project from '../templates/project-template';
import * as path from 'path'

export default class CreatePageTemplate extends Command {
    static description = 'Creates a page template and updates Administration files'

    async run() {
        var userConfig = await fs.readJSON(path.join(this.config.configDir, 'config.json'))
        try {
            var projectData = await fs.readJSON(path.join(this.config.dataDir, userConfig.currentProject))
        } catch (err) {
            console.log("Project file is missing. Create project or select different default project.")
            return
        }
        var project = Project.fromJSON(projectData);
        
        const templatID = await cli.prompt(
            "Enter ID of template (MyPageTemplate)"
            )
        const templateNameEng = await cli.prompt(
            "Enter English name for template (My page template)"
        )
        const templateNameSwe = await cli.prompt(
            "Enter Swedish name for template (Min sidomall)"
        )

        const pageTemplate = new PageTemplate(
            templatID, 
            templateNameEng, 
            templateNameSwe, 
            project.getPageTemplateFilePath(),
            project.getPageNameConstantsFilePath(),
            project.getAdminFilePath(),
            project.getCsprojFilePath()
        )

        try {
            await pageTemplate.createTemplateFile()
            await pageTemplate.updateAdmin()
            await pageTemplate.updateCsProj()
            await pageTemplate.updatePageNameConstants()
        } catch (err) {
            console.log(err)
        }
    }
}