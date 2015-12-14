require 'net/http'
require 'nokogiri'
require 'open-uri'
require 'json'

class YouTubeSearch

  def search_query(query, how_many)
    plusified_query = plusify(query)
    uri = "https://www.youtube.com/results?search_query=#{plusified_query}"
    doc = Nokogiri::HTML(open(uri))
    div_objects = doc.css(".yt-lockup-content").take(how_many)

    results = div_objects.map do |div|
      link_objects = div.css(".yt-lockup-title").children.select do |child|
         child.name == "a"
      end

      view_count = div.css(".yt-lockup-meta-info").children.last.text.gsub(/\D/,"").to_i
      link_objects.map do |link|
        {
          title: link.text,
          url: "https://www.youtube.com" + link.attributes["href"].value,
          views: view_count
        }
      end
    end.flatten
    results
  end

  private

  def plusify(string)
    string.split(" ").join("+")
  end

end

# # DEMO
# require_relative "../../../SIMPLE_WORDS"
# a = SIMPLE_WORDS.sample(3).join(' ')

# yt = YouTubeSearch.new
# qa = yt.search_query(a,3)

# puts a
# # puts qa
# puts JSON.parse(qa)
# puts
