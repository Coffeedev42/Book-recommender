import { useContext, useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import CheckBox from "../components/CheckBox";
import DropDown from "../components/DropDown";
import Button from "../components/Button";
import { Context } from "../context/ContextProvider";
import { Sparkle, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../components/Header";

const CollapsibleCard = ({
    title,
    description,
    children,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-[#522614]/20 rounded-lg overflow-hidden">
            <div
                className="flex justify-between items-center bg-[#f8f5f2] p-4 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div>
                    <h2 className="text-[#B9562D] inter-medium text-xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-[#522614]">{description}</p>
                    )}
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

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

    return (
        <div className="flex flex-col items-center w-full h-screen ">
            <Header
                step={2}
                path="/"
                steps={[
                    "Add liked books",
                    "Enter your preferences",
                    "Get Recommendations",
                ]}
            />

            <div className="flex flex-col gap-4 p-[50px] w-full">
                {/* Favourite Genres */}
                <CollapsibleCard
                    title="Favourite Genres"
                    description="Select your favourite genres"
                    defaultOpen={true} // open by default
                >
                    <div className="grid grid-cols-6 gap-x-7 gap-y-4">
                        {favGenresList.map((c, i) => (
                            <CheckBox
                                key={i}
                                cat={c}
                                type="fav"
                                handleSelect={handleToggleFavGenre}
                            />
                        ))}
                    </div>
                </CollapsibleCard>

                {/* Preferred Mood */}
                <CollapsibleCard title="Preferred Mood" defaultOpen={false}>
                    <DropDown
                        searchable
                        showLimit={7}
                        options={preferredMoodList}
                        selectedOption={preferredMood}
                        onSelect={(option) => setPreferredMood(option)}
                        placeholder="Select a mood"
                    />
                </CollapsibleCard>

                {/* Books Length */}
                <CollapsibleCard title="Books Length" defaultOpen={false}>
                    <DropDown
                        options={booksLengthList}
                        selectedOption={booksLength}
                        onSelect={(option) => setBooksLength(option)}
                        placeholder="Select length"
                    />
                </CollapsibleCard>

                {/* Recommendations Count */}
                <CollapsibleCard
                    title="Recommendations Count"
                    description="How many book recommendations do you want. It will affect the amount of credits used."
                    defaultOpen={false}
                >
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
                </CollapsibleCard>

                {/* Constraints */}
                <CollapsibleCard
                    title="Constraints"
                    description="Select your constraints for a more personalized recommendation"
                    defaultOpen={false}
                >
                    <div className="flex flex-wrap gap-4">
                        {constraintsList.map((c, i) => (
                            <CheckBox
                                key={i}
                                cat={c}
                                type="constraints"
                                handleSelect={handleToggleConstraint}
                            />
                        ))}
                    </div>
                </CollapsibleCard>
            </div>

            {/* Get Recommendations Button */}
            {addedBooks?.length >= 3 && (
                <div className="mt-6">
                    <Button
                        icon={<Sparkle />}
                        label="Get Recommendations"
                        onClick={() =>
                            navigate("/recommendations", { replace: true })
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default BookCategoryPage;
