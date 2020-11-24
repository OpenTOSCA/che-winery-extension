import { injectable, inject } from "inversify";
import {
    CommandContribution,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry,
    MessageService,
} from "@theia/core/lib/common";
import { CommonMenus, OpenerService, open } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

export const TestCommand = {
    id: "Test.command",
    label: "Say Hello",
};

@injectable()
export class WineryCommandContribution implements CommandContribution {
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(OpenerService) private readonly openerService: OpenerService,
        @inject(FileService) private readonly fileService: FileService
    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TestCommand, {
            execute: async () => {
                const queryParams = window.parent.location
                    .toString()
                    .split("?")[1];
                const cleanedUpQueryParams = queryParams.split("#")[0];
                const params = new URLSearchParams(cleanedUpQueryParams);
                const path = params.get("path");
                if (path) {
                    const uri = new URI(path);
                    const stat = await this.fileService.resolve(uri);
                    if (stat.children) {
                        const files = stat.children?.filter(
                            (stat) => stat.isFile
                        );
                        if (files.length > 0) {
                            const toscaFile = files.filter((file) =>
                                file.resource.toString().endsWith(".tosca")
                            )[0];
                            if (toscaFile) {
                                open(this.openerService, toscaFile.resource);
                            } else {
                                this.messageService.error(
                                    "Could not find Tosca file in folder: " +
                                        path
                                );
                            }
                        }
                    }
                } else {
                    this.messageService.error("Failed to parse folder path from URL")
                }
            },
        });
    }
}

@injectable()
export class WineryMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: TestCommand.id,
            label: TestCommand.label,
        });
    }
}
