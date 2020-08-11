import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { WorkspaceService } from "@theia/workspace/lib/browser"
import { CommonMenus, OpenerService, open } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";

export const TestCommand = {
    id: 'Test.command',
    label: "Say Hello"
};

@injectable()
export class TestCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(OpenerService) private readonly openerService: OpenerService,
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TestCommand, {
            execute: () => {
                var queryParams = window.parent.location.toString().split("?")[1]
                var params = new URLSearchParams(queryParams)
                var fileToOpen = params.get("file")
                if (fileToOpen) {
                    var parent = this.workspaceService.workspace?.uri.toString() || "";
                    var uri = new URI(parent + "/" + fileToOpen)
                    this.messageService.info(window.parent.location.toString());
                    this.messageService.info(uri?.toString() || "test");
                    open(this.openerService, uri)
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
