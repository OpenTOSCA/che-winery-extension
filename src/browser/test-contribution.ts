import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { WorkspaceService } from "@theia/workspace/lib/browser"
import { CommonMenus, OpenerService, open } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

export const TestCommand = {
    id: 'Test.command',
    label: "Say Hello"
};

@injectable()
export class TestCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(OpenerService) private readonly openerService: OpenerService,
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(FileService) private readonly fileService: FileService
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TestCommand, {
            execute: async () => {
                const queryParams = window.parent.location.toString().split("?")[1]
                const cleanedUpQueryParams = queryParams.split("#")[0];
                const params = new URLSearchParams(cleanedUpQueryParams)
                const parentPath = params.get("parentPath")
                const ns = params.get("ns")
                const id = params.get("id")
                if (parentPath) {
                    const parent = this.workspaceService.workspace?.resource.toString() || "";
                    const uri = new URI(parent + "/" + parentPath + "/" + ns + "/" + id)
                    const stat = await this.fileService.resolve(uri)
                    if(stat.children) {
                        const files = stat.children?.filter(stat => stat.isFile)
                        if(files.length > 0) {
                            const firstFile = files[0].resource.toString()
                            this.messageService.info(firstFile);
                            open(this.openerService, new URI(firstFile))
                        }
                    }
                }
            }
        });
    }
}

@injectable()
export class TestMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: TestCommand.id,
            label: TestCommand.label
        });
    }
}
