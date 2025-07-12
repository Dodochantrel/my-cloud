export interface RoleDto {
    roles: string[];
}

export const mapFromRoleDtoToRoles = (dto: RoleDto): string[] => {
    return dto.roles;
};

export const mapFromDtosToRoles = (dtos: RoleDto[]): string[] => {
    return dtos.flatMap((dto) => mapFromRoleDtoToRoles(dto));
};