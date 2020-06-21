import {Command, flags} from "@oclif/command"
import cli from "cli-ux"
import PageTemplate from "../templates/page-template"
import * as fs from "fs-extra"
import Project from '../templates/project-template';

export default class CreatePageTemplate extends Command {
    async run() {
        var userConfig = await fs.readJSON('./config.json')
        var projectData = await fs.readJSON(`./src/projects/${userConfig.currentProject}`)
        var project = Project.fromJSON(projectData);
        
        const templatID = await cli.prompt(
            "Enter ID of template (MyPageTemplate)"
            )
        const templateNameEng = await cli.prompt(
            "Enter English name for template"
        )
        const templateNameSwe = await cli.prompt(
            "Enter Swedish name for template"
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

        await pageTemplate.createTemplateFile()
        await pageTemplate.updateAdmin()
        await pageTemplate.updateCsProj()
        await pageTemplate.updatePageNameConstants()
    }
}