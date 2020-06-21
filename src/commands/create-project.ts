import {Command, flags} from '@oclif/command'
import * as fs from 'fs-extra'
import Project from '../templates/project-template'
import cli from 'cli-ux'
import slugify from "slugify"
import * as path from "path"

export default class CreateFile extends Command {
    static description = "Creates a project with information about file path"

    async run() {
        const rootDir : string = await cli.prompt('Enter the root path to your project')
        const projectName : string = await cli.prompt("Enter project name")
        var project = new Project(rootDir, projectName)
        var data = JSON.stringify(project)
        try {
            fs.writeFileSync(path.join(this.config.dataDir, `${slugify(projectName.toLowerCase())}.json`), data)
        } catch (err) {
            console.log(err)
        }
    }
}