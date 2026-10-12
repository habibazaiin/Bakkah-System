from app.core.database import supabase
from fastapi import HTTPException

class TeamService:
    @staticmethod
    def create_team(space_id: str, name: str, description: str):
        data = {"space_id": space_id, "name": name, "description": description}
        res = supabase.table("teams").insert(data).execute()
        return res.data[0]
        
    @staticmethod
    def get_space_teams(space_id: str):
        # 1. جلب الفرق الخاصة بالمساحة
        teams_res = supabase.table("teams").select("*").eq("space_id", space_id).execute()
        teams = teams_res.data
        
        # 2. جلب أعضاء كل فريق ودمجهم مع الفريق
        for team in teams:
            members_res = supabase.table("team_members").select("user_id").eq("team_id", team["id"]).execute()
            team["members"] = [m["user_id"] for m in members_res.data]
            
        return teams

    @staticmethod
    def add_member_to_team(team_id: str, user_id: str):
        try:
            res = supabase.table("team_members").insert({"team_id": team_id, "user_id": user_id}).execute()
            return res.data[0]
        except Exception as e:
            if "duplicate key" in str(e).lower():
                raise HTTPException(status_code=400, detail="User is already in this team")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def remove_member_from_team(team_id: str, user_id: str):
        supabase.table("team_members").delete().eq("team_id", team_id).eq("user_id", user_id).execute()
        return {"message": "Member removed from team"}
        
    @staticmethod
    def delete_team(team_id: str):
        supabase.table("teams").delete().eq("id", team_id).execute()
        return {"message": "Team deleted successfully"}