require 'net/http'
require 'nokogiri'
require 'open-uri'
require 'json'

class YouTubeSearch

	def get_query
		puts ">>>> Enter text to search for on YouTube: "
		search_query = gets.chomp
		plusify(search_query)
	end

	def ask_how_many
		puts ">>>> How many videos would you like (up to 20)?"
		gets.chomp.to_i
	end

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
		results.to_json
	end

	private

	def plusify(string)
		string.split(" ").join("+")
	end

end

require_relative "SIMPLE_WORDS"
a = SIMPLE_WORDS.sample(3).join(' ')
b = SIMPLE_WORDS.sample(3).join(' ')
c = SIMPLE_WORDS.sample(3).join(' ')

yt = YouTubeSearch.new
qa = yt.search_query(a,3)
qb = yt.search_query(b,3)
qc = yt.search_query(c,3)

puts a
puts qa
puts JSON.parse(qa)
# p qa.inject(0) {|accum, ele| ele[:views] + accum }.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
puts

puts b
puts qb
puts JSON.parse(qb)
# p qb.inject(0) {|accum, ele| ele[:views] + accum }.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
puts

puts c
puts qc
puts JSON.parse(qc)
# p qc.inject(0) {|accum, ele| ele[:views] + accum }.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
puts