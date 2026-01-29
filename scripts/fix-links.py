import os
import re
import json

base_url = "https://mtim.ruqyahbd.org"
posts_json_path = os.path.join("src", "data", "posts.json")

# Load posts to get valid IDs
with open(posts_json_path, "r", encoding="utf-8") as f:
    posts = json.load(f)
    valid_ids = {p["id"] for p in posts}

def fix_links(content):
    # Regex for GitHub Wiki links
    wiki_pattern = r"https://github\.com/ruqyahbd/mtim/wiki/([^ \)\n]+)"
    
    def replace_link(match):
        wiki_id = match.group(1)
        # Convert Wiki-style ID to our ID
        # Wiki uses : but our filenames use _
        # Also handle URL encoding issues if any
        possible_id = wiki_id.replace(":", "_")
        
        # Some special cases if needed
        # ...
        
        if possible_id in valid_ids:
            return f"{base_url}/post/{possible_id}"
        
        # Fallback if not found in valid_ids: check if removing trailing punctuation helps
        cleaned_id = possible_id.rstrip(".)")
        if cleaned_id in valid_ids:
            return f"{base_url}/post/{cleaned_id}"
            
        return match.group(0) # Keep original if not found

    return re.sub(wiki_pattern, replace_link, content)

# Process all MD files in root and public
directories = [".", "public"]
for d in directories:
    if not os.path.exists(d): continue
    for file in os.listdir(d):
        if file.endswith(".md"):
            path = os.path.join(d, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = fix_links(content)
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated links in {path}")

print("Internal link fix complete.")
