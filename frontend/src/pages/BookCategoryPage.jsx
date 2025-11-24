import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigateComponenet from "../components/NavigateComponent";
import LogoutButton from "../components/LogoutButton";
import CheckBox from "../components/CheckBox";
import DropDown from "../components/DropDown";
import Button from "../components/Button";
import { Context } from "../context/ContextProvider";
import { Sparkle } from "lucide-react";

const BookCategoryPage = () => {
    const {
        addedBooks,
        setFavGenres,
        setConstraints,
        preferredMood,
        setPreferredMood,
        booksLength,
        setBooksLength,
        recCount,
        setRecCount,
        preferredMoodList,
        booksLengthList,
        constraintsList,
        favGenresList,
        recCountList,
    } = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        if (addedBooks.length === 0) navigate("/");
    }, [addedBooks, navigate]);

    const handleToggleFavGenre = (cat) => {
        setFavGenres((prev) =>
            prev.includes(cat)
                ? prev.filter((item) => item !== cat)
                : [...prev, cat]
        );
    };

    const handleToggleConstraint = (cat) => {
        setConstraints((prev) =>
            prev.includes(cat)
                ? prev.filter((item) => item !== cat)
                : [...prev, cat]
        );
    };

    const sectionClass =
        "flex flex-col gap-2.5 pb-6 border-b border-b-[#522614]/20";
    const headingClass = "text-[#B9562D] inter-medium text-2xl";
    const paragraphClass = "text-[#522614]";

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-cover bg-no-repeat bg-[url('./assets/cover.png')] p-6">
            <NavigateComponenet step={2} path="/" />
            <LogoutButton />

            <div className="flex flex-col gap-8 max-w-[900px] w-full">
                {/* Favourite Genres */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Favourite Genres</h2>
                    <p className={paragraphClass}>
                        Select your favourite genres
                    </p>
                    <div className="grid grid-cols-4 gap-x-7 gap-y-4 mt-4">
                        {favGenresList.map((c, i) => (
                            <CheckBox
                                key={i}
                                cat={c}
                                type="fav"
                                handleSelect={handleToggleFavGenre}
                            />
                        ))}
                    </div>
                </div>

                {/* Preferred Mood */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Preferred Mood</h2>
                    <DropDown
                        options={preferredMoodList}
                        selectedOption={preferredMood}
                        onSelect={(option) => setPreferredMood(option)}
                        placeholder="Select a mood"
                    />
                </div>

                {/* Books Length */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Books Length</h2>
                    <DropDown
                        options={booksLengthList}
                        selectedOption={booksLength}
                        onSelect={(option) => setBooksLength(option)}
                        placeholder="Select length"
                    />
                </div>

                {/* Number of Recommendations */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Recommendations Count</h2>
                    <p className={paragraphClass}>
                        How many book recommendations do you want. It will
                        affect the amount of credits used.
                    </p>

                    <DropDown
                        options={recCountList.map((item) => item.label)}
                        selectedOption={recCount?.label}
                        onSelect={(label) =>
                            setRecCount(
                                recCountList.find(
                                    (item) => item.label === label
                                )
                            )
                        }
                        placeholder="Select count"
                    />
                </div>

                {/* Constraints */}
                <div className={sectionClass}>
                    <h2 className={headingClass}>Constraints</h2>
                    <p className={paragraphClass}>
                        Select your constraints for a more personalized
                        recommendation
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {constraintsList.map((c, i) => (
                            <CheckBox
                                key={i}
                                cat={c}
                                type="constraints"
                                handleSelect={handleToggleConstraint}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Get Recommendations Button */}
            {addedBooks?.length >= 3 && (
                <div className="mt-6">
                    <Button
                        icon={<Sparkle />}
                        label="Get Recommendations"
                        onClick={() => navigate("/recommendations")}
                    />
                </div>
            )}
        </div>
    );
};

export default BookCategoryPage;
