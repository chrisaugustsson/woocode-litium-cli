import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import Project from '../templates/project-template'
import cli from 'cli-ux'
import slugify from "slugify"

export default class CreateFile extends Command {
    async run() {
        const rootDir : string = await cli.prompt('Enter the root path to your project')
        const projectName : string = await cli.prompt("Enter project name")
        var project = new Project(rootDir, projectName)
        var data = JSON.stringify(project)
        try {
            fs.writeFileSync(`src/projects/${slugify(projectName.toLowerCase())}.json`, data)
        } catch (err) {
            console.log(err)
        }
    }
}