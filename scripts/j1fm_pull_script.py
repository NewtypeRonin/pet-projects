#The idea for this script is, we're gonna scrape j1fm's radio site
#and then we're gonna get the current song that's playing
#From there we output that new song to a text file, an existing one is fine, first we need to check if the song is different from the last one, if it is then we write it to the file, if not we do nothing
# from there we'll set up a cron job to run this script every minute, so we can keep the text file updated with the current song that's playing on j1fm's radio site
#ideally we can also set up a simple web server to serve the text file, so we can easily access it from our phones or other devices
#But also the end goal is to be able to directly add to people's spotifys, youtube, applemusic, or wherever they might have accounts
#So we can have a playlist of the songs that have been played on j1fm's radio site, and then we can easily add those songs to our own playlists on our music streaming services
#But for now, let's just focus on getting the current song that's playing on j1fm's radio site and writing it to a text file if it's different from the last one.   
#J1's radio site: https://rec.torontocast.stream/player/ it can be picked from j1 hits and all that, but it also has a previously played section, so we can just scrape that and get the most recent song that's played, which should be the current one that's playing on the radio site.  
# they're offical homepage is https://www.j1fm.tokyo/, however that's ntot where the radio is, the radio is on the rec.torontocast.stream/player/ site, which is where we can scrape the current song that's playing.
import requests
from bs4 import BeautifulSoup
import os
import re

def get_current_song():
    """
    Scrapes the current song from the J1FM homepage.
    
    Instructions to refine the selectors:
    1. Visit https://www.j1fm.tokyo/ in your browser
    2. Open Developer Tools (F12 or right-click > Inspect)
    3. Look for the "This is what we play!" section
    4. Find the "J1 HITS" section and locate the song/artist info
    5. Right-click on the song text and select "Inspect" to see the HTML structure
    6. Note the div class, id, or element tag that contains the song
    7. Update the selectors below based on what you find
    
    Example HTML structure you might find:
    <div class="playlist-item">
        <span class="artist">Southern All Stars</span>
        <span class="song">Tokyo Victory</span>
    </div>
    
    Or it could be structured as:
    <li>
        <strong>Tokyo Victory</strong>
        <span>Southern All Stars</span>
    </li>
    """
    url = 'https://www.j1fm.tokyo/'
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # TODO: Update these selectors based on your inspection:
        # Option 1: Find by specific div class (most reliable)
        # song_element = soup.find('div', class_='your-class-name')
        
        # Option 2: Find by tag within a specific container
        # container = soup.find('section', class_='now-playing')
        # song_element = container.find('span', class_='song-title')
        
        # Option 3: Find by text pattern (current approach)
        j1_hits_section = soup.find(string=re.compile(r'J1 HITS'))
        if j1_hits_section:
            # Get the parent and find the song text
            parent = j1_hits_section.parent
            text = parent.get_text()
            lines = text.split('\n')
            if len(lines) > 2:
                song = lines[2].strip()  # e.g., Tokyo Victory
                artist = lines[3].strip() if len(lines) > 3 else ''  # Southern All Stars
                return f"{song} - {artist}" if artist else song
        
        return None
    except Exception as e:
        print(f"Error fetching current song: {e}")
        return None

def main():
    song_file = 'current_song.txt'
    current_song = get_current_song()
    if current_song:
        last_song = ''
        if os.path.exists(song_file):
            with open(song_file, 'r', encoding='utf-8') as f:
                last_song = f.read().strip()
        if current_song != last_song:
            with open(song_file, 'w', encoding='utf-8') as f:
                f.write(current_song)
            print(f"Updated song: {current_song}")
        else:
            print("Song unchanged")
    else:
        print("Could not retrieve current song")

if __name__ == "__main__":
    main()

